import {Component, OnInit} from '@angular/core';
import {CardsList} from "../../../utils/common-models";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-pharmaceutical-raw-materials',
  templateUrl: './pharmaceutical-raw-materials.component.html',
  styleUrls: ['./pharmaceutical-raw-materials.component.scss']
})
export class PharmaceuticalRawMaterialsComponent implements OnInit {
  routingPath: string;
  pharmaceuticalRawMaterialImportationServices: CardsList[] = [
    {
      id: '',
      name: {
        en: 'text1',
        ar: 'الجملة 1'
      },
      description: {
        en: 'text1',
        ar: 'الجملة 1'
      },
      newRequestLink: '/pages/pharmaceutical-raw-material/inner/new-request',
      draftListLink: '/pages/pharmaceutical-raw-material/inner/draft-request',
      trackListLink: '/pages/pharmaceutical-raw-material/inner/track-request',
      newImortedRequestLink: '#',
      draftImportedListLink: '#',
      trackImportedListLink: '#',
      icon: 'fas fa-pills'
    },
    {
      id: '',
      name: {
        en: 'text1',
        ar: 'الجملة 1'
      },
      description: {
        en: 'text1',
        ar: 'الجملة 1'
      },
      newRequestLink: '/pages/pharmaceutical-raw-material/inner/new-request',
      draftListLink: '/pages/pharmaceutical-raw-material/inner/draft-request',
      trackListLink: '/pages/pharmaceutical-raw-material/inner/track-request',
      newImortedRequestLink: '#',
      draftImportedListLink: '#',
      trackImportedListLink: '#',
      icon: 'fas fa-pills'
    },
    {
      id: '',
      name: {
        en: 'text1',
        ar: 'الجملة 1'
      },
      description: {
        en: 'text1',
        ar: 'الجملة 1'
      },
      newRequestLink: '/pages/pharmaceutical-raw-material/inner/new-request',
      draftListLink: '/pages/pharmaceutical-raw-material/inner/draft-request',
      trackListLink: '/pages/pharmaceutical-raw-material/inner/track-request',
      newImortedRequestLink: '#',
      draftImportedListLink: '#',
      trackImportedListLink: '#',
      icon: 'fas fa-pills'
    },
    {
      id: '',
      name: {
        en: 'text1',
        ar: 'الجملة 1'
      },
      description: {
        en: 'text1',
        ar: 'الجملة 1'
      },
      newRequestLink: '/pages/pharmaceutical-raw-material/inner/new-request',
      draftListLink: '/pages/pharmaceutical-raw-material/inner/draft-request',
      trackListLink: '/pages/pharmaceutical-raw-material/inner/track-request',
      newImortedRequestLink: '#',
      draftImportedListLink: '#',
      trackImportedListLink: '#',
      icon: 'fas fa-pills'
    },
    {
      id: '',
      name: {
        en: 'text1',
        ar: 'الجملة 1'
      },
      description: {
        en: 'text1',
        ar: 'الجملة 1'
      },
      newRequestLink: '/pages/pharmaceutical-raw-material/inner/new-request',
      draftListLink: '/pages/pharmaceutical-raw-material/inner/draft-request',
      trackListLink: '/pages/pharmaceutical-raw-material/inner/track-request',
      newImortedRequestLink: '#',
      draftImportedListLink: '#',
      trackImportedListLink: '#',
      icon: 'fas fa-pills'
    },
  ];
  pharmaceuticalRawMaterialReleaseServices: CardsList[] = [
    {
      id: '',
      name: {
        en: 'text 4',
        ar: 'الجملة41'
      },
      description: {
        en: 'text1',
        ar: 'الجملة 1'
      },
      newRequestLink: '',
      draftListLink: '',
      trackListLink: '',
      newImortedRequestLink: '#',
      draftImportedListLink: '#',
      trackImportedListLink: '#',
      icon: 'fas fa-pills'
    },
    {
      id: '',
      name: {
        en: 'text1',
        ar: 'الجملة 1'
      },
      description: {
        en: 'text1',
        ar: 'الجملة 1'
      },
      newRequestLink: '',
      draftListLink: '',
      trackListLink: '',
      newImortedRequestLink: '#',
      draftImportedListLink: '#',
      trackImportedListLink: '#',
      icon: 'fas fa-pills'
    },
    {
      id: '',
      name: {
        en: 'text1',
        ar: 'الجملة 1'
      },
      description: {
        en: 'text1',
        ar: 'الجملة 1'
      },
      newRequestLink: '',
      draftListLink: '',
      trackListLink: '',
      newImortedRequestLink: '#',
      draftImportedListLink: '#',
      trackImportedListLink: '#',
      icon: 'fas fa-pills'
    },
    {
      id: '',
      name: {
        en: 'text1',
        ar: 'الجملة 1'
      },
      description: {
        en: 'text1',
        ar: 'الجملة 1'
      },
      newRequestLink: '',
      draftListLink: '',
      trackListLink: '',
      newImortedRequestLink: '#',
      draftImportedListLink: '#',
      trackImportedListLink: '#',
      icon: 'fas fa-pills'
    },
    {
      id: '',
      name: {
        en: 'text1',
        ar: 'الجملة 1'
      },
      description: {
        en: 'text1',
        ar: 'الجملة 1'
      },
      newRequestLink: '',
      draftListLink: '',
      trackListLink: '',
      newImortedRequestLink: '#',
      draftImportedListLink: '#',
      trackImportedListLink: '#',
      icon: 'fas fa-pills'
    },
  ];

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.routingPath = event.url.split('/')[4];
      }
    });
  }

  ngOnInit(): void {
  }
}
