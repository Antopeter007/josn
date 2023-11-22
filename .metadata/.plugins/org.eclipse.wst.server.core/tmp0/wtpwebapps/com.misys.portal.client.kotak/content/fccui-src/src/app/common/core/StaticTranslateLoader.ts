import { TranslateService } from '@ngx-translate/core';

export class StaticTranslateLoader {

    static translation: TranslateService = null;
    static setTranslationService(translation: TranslateService) {
        StaticTranslateLoader.translation = translation;
    }
}
