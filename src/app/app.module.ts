import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/generic/header/header.component';
import { HomeComponent } from './home/home.component';
import { CompetitionComponent } from './components/competition/competition.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { PrimengModule } from './shared/primeng.module';
import { FooterComponent } from './components/generic/footer/footer.component';
import { CompareEhbComponent } from './components/compare-ehb/compare-ehb.component';
import { UpdatePlayersModalComponent } from './components/competition/update-players-modal/update-players-modal.component';


@NgModule({ declarations: [
        AppComponent,
        HeaderComponent,
        HomeComponent,
        CompetitionComponent,
        FooterComponent,
        CompareEhbComponent,
        UpdatePlayersModalComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        PrimengModule,
        ReactiveFormsModule,
        BrowserAnimationsModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
