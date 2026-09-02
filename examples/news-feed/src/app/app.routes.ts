import { Routes } from '@angular/router';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const routes: Routes = [
    { path: '', redirectTo: 'news-feed', pathMatch: 'full' },
    { path: 'news-feed', loadComponent: () => import('./pages/news-feed/news-feed/news-feed.component').then(m => m.NewsFeed) },
];
