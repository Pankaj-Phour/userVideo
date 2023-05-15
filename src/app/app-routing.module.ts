import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WatchvideoComponent } from './watchvideo/watchvideo.component';

const routes: Routes = [
  {path:'', component:WatchvideoComponent}
];

@NgModule({

  // Added hashRouting to navigate smoothly on different pages on january 17 2023
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
