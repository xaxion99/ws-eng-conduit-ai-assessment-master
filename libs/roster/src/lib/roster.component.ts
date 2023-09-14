import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { switchMap, map } from 'rxjs/operators';
import { RosterService } from './roster.service';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'conduit-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.css'],
})
export class RosterComponent implements OnInit {
  userStats$!: Observable<any[]>;

  constructor(private rosterService: RosterService) {}

  ngOnInit() {
    this.userStats$ = this.rosterService.getUsers().pipe(
      switchMap(data => {
        const userStatsDict: any = {};
        const userObjects = Object.values(data);
        let cnt = 1;
        for (let userObject of userObjects) {
          const username = userObject.user.username;
          userStatsDict[cnt] = {
            username: username,
            profileLink: `/profile/${username}`,
            articleCount: 0,
            totalLikes: 0,
            firstArticleDate: null
          };
          cnt++;
        }
        return this.rosterService.getArticles().pipe(
          map(response => {
            const articles = response.articles;
            for (const article of articles) {
              const authorId = article.author.id;
              const stats = userStatsDict[authorId];
              if (stats) {
                stats.articleCount++;
                stats.totalLikes += article.favoritesCount;
                const articleDate = new Date(article.createdAt);
                if (!stats.firstArticleDate || articleDate < new Date(stats.firstArticleDate)) {
                  stats.firstArticleDate = articleDate;
                }
              }
            }
            return Object.values(userStatsDict).sort((a: any, b: any) => b.totalLikes - a.totalLikes);
          })
        );
      })
    );
  }
}
