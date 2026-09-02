import { Routes } from '@angular/router';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const routes: Routes = [
    { path: '', redirectTo: 'online-store', pathMatch: 'full' },
    { path: 'online-store', loadComponent: () => import('./pages/online-store/online-store/online-store.component').then(m => m.OnlineStore) },
];
