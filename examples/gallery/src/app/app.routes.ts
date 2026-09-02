import { Routes } from '@angular/router';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const routes: Routes = [
    { path: '', redirectTo: 'gallery', pathMatch: 'full' },
    { path: 'gallery', loadComponent: () => import('./pages/gallery/gallery-page.component').then(m => m.GalleryPageComponent) },
];
