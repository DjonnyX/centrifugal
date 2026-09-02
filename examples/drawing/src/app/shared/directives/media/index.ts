import { DeviceTypes, MediaSizes } from './enums';
import { IMediaParams, IMediaConfig } from './interfaces';
import { DeviceType, MediaSize } from './types';
import { MediaDirective } from './media.directive';
import { MediaService } from './media.service';
import { MEDIA_CONFIG } from './const';

export {
    DeviceTypes,
    MediaSizes,
    MediaDirective,
    MediaService,
    MEDIA_CONFIG,
}

export type {
    IMediaParams,
    IMediaConfig,
    DeviceType,
    MediaSize,
}