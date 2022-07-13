import { Injectable } from '@angular/core';
import { LoginService } from './LoginService';
import * as _ from 'lodash';
import { Destroyable } from '@ts-core/common';
import { SettingsService } from './SettingsService';
import { FILE_TEMPORARY_IMAGE_URL } from '@project/common/platform/api';
import { PipeService } from './PipeService';

@Injectable({ providedIn: 'root' })
export class CkeditorService extends Destroyable {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    private _descriptionSettings: any;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(private settings: SettingsService, private login: LoginService, private pipe: PipeService) {
        super();
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get descriptionSettings(): any {
        if (_.isNil(this._descriptionSettings)) {
            this._descriptionSettings = {
                placeholder: `${this.pipe.language.translate('general.description')}...`,
                toolbar: {
                    language: 'en',
                    position: 'sticky',
                    items: [
                        'heading',
                        'bold',
                        'italic',
                        'underline',
                        'strikethrough',
                        'link',
                        '|',
                        'alignment',
                        'blockQuote',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'fontFamily',
                        'fontSize',
                        'fontColor',
                        'fontBackgroundColor',
                        'removeFormat',
                        '|',
                        'imageUpload',
                        'insertTable',
                        'mediaEmbed',
                        '|',
                        'indent',
                        'outdent',
                        //'code',
                        '|',
                        'imageInsert',
                        //'htmlEmbed',
                        'horizontalLine'
                    ],
                },
                image: {
                    styles: ['alignLeft', 'alignCenter', 'alignRight', 'block', 'side'],
                    resizeOptions: [
                        {
                            name: 'imageResize:original',
                            value: null,
                            icon: 'original',
                        },
                        {
                            name: 'imageResize:25',
                            value: '25',
                            icon: 'small',
                        },
                        {
                            name: 'imageResize:50',
                            value: '50',
                            icon: 'medium',
                        },
                        {
                            name: 'imageResize:75',
                            value: '75',
                            icon: 'large',
                        },
                    ],
                    toolbar: [
                        'imageStyle:alignLeft',
                        'imageStyle:alignCenter',
                        'imageStyle:alignRight',
                        'imageStyle:block',
                        'imageStyle:side',
                        '|',
                        'imageResize:25',
                        'imageResize:50',
                        'imageResize:75',
                        'imageResize:original',
                        '|',
                        'linkImage',
                        'imageTextAlternative',
                    ],
                },
                table: {
                    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableCellProperties', 'tableProperties'],
                },
                fontFamily: {
                    supportAllValues: true,
                    options: [
                        'default',
                        'Arial, Helvetica, sans-serif',
                        'Courier New, Courier, monospace',
                        'Georgia, serif',
                        'Lucida Sans Unicode, Lucida Grande, sans-serif',
                        'Tahoma, Geneva, sans-serif',
                        'Times New Roman, Times, serif',
                        'Trebuchet MS, Helvetica, sans-serif',
                        'Verdana, Geneva, sans-serif',
                        'Nunito Sans, sans-serif',
                    ],
                },
                simpleUpload: {
                    uploadUrl: `${this.settings.apiUrl}${FILE_TEMPORARY_IMAGE_URL}`,
                    headers: {
                        Authorization: `Bearer ${this.login.sid}`,
                    }
                },
                mediaEmbed: {
                    previewsInData: true,
                },
                // removePlugins: ['MediaEmbedToolbar'],
                licenseKey: '',
            };
        }
        return this._descriptionSettings;
    }
}


