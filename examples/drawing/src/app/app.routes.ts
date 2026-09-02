import { Routes } from '@angular/router';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const routes: Routes = [
    { path: '', redirectTo: 'drawing', pathMatch: 'full' },
    { path: 'drawing', loadComponent: () => import('./pages/painting-canvas/painting-canvas/painting-canvas.component').then(m => m.PaintingCanvas) },
];
