import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NotificationService, ShellBaseComponent, ViewUtil } from '@ts-core/angular';
import { RouterService, PipeService, SettingsService } from '../../../../module/core/service';
import { filter, takeUntil } from 'rxjs';
import { ShellMenu } from './service';
import { MatSidenavContent } from '@angular/material/sidenav';

@Component({
    templateUrl: './shell-page.component.html',
    styleUrls: ['./shell-page.component.scss']
})
export class ShellPageComponent extends ShellBaseComponent implements AfterViewInit {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    @ViewChild('container', { static: true })
    public container: MatSidenavContent;
    public isNeedScrollButton: boolean = false;

    public version: string;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(
        notifications: NotificationService,
        breakpointObserver: BreakpointObserver,
        router: RouterService,
        element: ElementRef,
        pipe: PipeService,
        public settings: SettingsService,
        public menu: ShellMenu
    ) {
        super(notifications, breakpointObserver);
        ViewUtil.addClasses(element, 'd-block w-100 h-100');

        this.version = pipe.language.translate('general.footer', { version: this.settings.version, versionDate: pipe.momentDate.transform(this.settings.versionDate, 'LLL'), });
        /*
transport.sendListen(new ImageCropCommand({})).then(async data => {
console.log(await api.fileBase64Upload({
    data: data.source,
    type: 'picture',
    linkId: 1,
    linkType: FileLinkType.PROJECT,
    extension: 'png',
    mime: 'image/png'
}));

let uploader = new Uploader(`${this.settings.apiUrl}${FILE_URL}`, false, 1);
uploader.fileBuildForm = (file, form) => {
    form.append('type', 'PICTURE');
    form.append('linkId', '1');
    form.append('linkType', FileLinkType.PROJECT);
};
uploader.fileUploadedData = (file, response) => FileMapCollection.parseItem(JSON.parse(response));
uploader.fileBeforeUpload = file => (file.file.withCredentials = false);
uploader.uploader.authToken = `Bearer ${login.sid}`;
uploader.events.pipe(takeUntil(this.destroyed)).subscribe(event => {
    console.log(event);
});
let file = Base64Util.addBase64File(uploader, data);
uploader.uploadAll();
// uploader.fileComplete.pipe(takeUntil(this.destroyed)).subscribe(item => (item.file = file.file.data));
});
*/

        router.completed.pipe(
            filter(() => !router.isUrlActive(router.previousUrl)),
            takeUntil(this.destroyed)).subscribe(() => this.scrollTop());
    }

    //--------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    //--------------------------------------------------------------------------

    public async ngAfterViewInit(): Promise<void> {
        this.initialize();
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public scrollTop(): void {
        this.container.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
