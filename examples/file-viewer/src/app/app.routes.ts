import { Routes } from '@angular/router';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const routes: Routes = [
    { path: '', redirectTo: 'file-viewer', pathMatch: 'full' },
    { path: 'file-viewer', loadComponent: () => import('./pages/file-viewer/file-viewer/file-viewer.component').then(m => m.FileViewer) },
];
