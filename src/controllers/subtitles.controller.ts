import { IRoute, IResponse } from '@interfaces/route';
import { ISubtitle } from '@interfaces/subtitle';
import { Queue } from '@queue';
import { OK } from 'http-status';

interface ISubtitleController {
    create({ req, res, next }: IRoute): Promise<IResponse<void>>;
}

class SubtitleController implements ISubtitleController {
    public async create({ req, res, next }: IRoute): Promise<IResponse<void>> {
        try {
            const languages: ISubtitle = req.body;

            if (req.files) {
                // @ts-ignore
                req.files.forEach((file) => {
                    Queue.create('subtitles_upload', {
                        sourceLanguage: languages.sourceLanguage,
                        targetLanguage: languages.targetLanguage,
                        file,
                        _user: req.user.id,
                    })
                        .removeOnComplete(true)
                        .save();
                });
            }

            return res.status(OK).json({
                msg: 'subtitles sent to translate, you will receive in your registered email when we finish the job',
            });
        } catch (error) {
            return next(error);
        }
    }
}

export default SubtitleController;