import { Routes } from '@angular/router';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const routes: Routes = [
    { path: '', redirectTo: 'swipe-image', pathMatch: 'full' },
    { path: 'swipe-image', loadComponent: () => import('./pages/swipe-image/swipe-image/swipe-image.component').then(m => m.SwipeImage) },
];
