import { Routes } from '@angular/router';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const routes: Routes = [
    { path: '', redirectTo: 'book-reader', pathMatch: 'full' },
    { path: 'book-reader', loadComponent: () => import('./pages/book-reader/book-reader/book-reader.component').then(m => m.BookReader) },
];
