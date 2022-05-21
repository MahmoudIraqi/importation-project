import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PharmaceuticalRawMaterialsContainerComponent} from "./pharmaceutical-raw-materials-container/pharmaceutical-raw-materials-container.component";
import {ApplicationGuard} from "../application.guard";
import {CustomReleaseComponent} from "../custom-release/custom-release.component";
import {PharmaceuticalRawMaterialsComponent} from "./pharmaceutical-raw-materials/pharmaceutical-raw-materials.component";
import {DraftRequestsComponent} from "./draft-requests/draft-requests.component";
import {TrackRequestsComponent} from "./track-requests/track-requests.component";

const routes: Routes = [
  {
    path: 'inner',
    component: PharmaceuticalRawMaterialsContainerComponent,
    children: [
      {
        path: 'importation-services',
        component: PharmaceuticalRawMaterialsComponent,
        data: {animation: 'inner'}
      },
      {
        path: 'release-services',
        component: PharmaceuticalRawMaterialsComponent,
        data: {animation: 'inner'}
      },
      {
        path: 'new-request',
        component: CustomReleaseComponent,
        data: {animation: 'inner'}
      },
      {
        path: 'draft-request',
        component: DraftRequestsComponent,
        data: {animation: 'inner'}
      },
      {
        path: 'track-request',
        component: TrackRequestsComponent,
        data: {animation: 'inner'}
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PharmaceuticalRawMaterialsRoutingModule {
}
