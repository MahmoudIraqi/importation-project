import {DepartmentBEModel, MenuObjectCommonKeys} from "./common-models";

export const menuObjectKeys: MenuObjectCommonKeys = {
  RAW_MATERIALS: {
    baseLink: '/pages/pharmaceutical-raw-material',
    baseIcon: 'fas fa-pills',
    servicesIcon: 'fas fa-pills',
    newRequestLink: '#',
    draftListLink: '#',
    trackListLink: '#',
    newImortedRequestLink: '#',
    draftImportedListLink: '#',
    trackImportedListLink: '#',
    dropdownLinks: {
      IMPORTATION_RAW_MATERIALS: {
        link: '#',
        icon: 'fas fa-shipping-fast',
      },
      RELEASE_RAW_MATERIALS: {
        link: '#',
        icon: 'fas fa-dolly-flatbed'
      }
    }
  },
  PHARMACEUTICAL_PRODUCTS: {
    baseLink: '#',
    baseIcon: 'fas fa-first-aid',
    servicesIcon: 'fas fa-first-aid',
    newRequestLink: '#',
    draftListLink: '#',
    trackListLink: '#',
    newImortedRequestLink: '#',
    draftImportedListLink: '#',
    trackImportedListLink: '#',
    dropdownLinks: {
      IMPORTATION_PHARMACEUTICAL_PRODUCTS: {
        link: '#',
        icon: 'fas fa-shipping-fast',
      },
      RELEASE_PHARMACEUTICAL_PRODUCTS: {
        link: '#',
        icon: 'fas fa-dolly-flatbed'
      }
    }
  },
  BIOLOGICAL: {
    baseLink: '#',
    baseIcon: 'fas fa-dna',
    servicesIcon: 'fas fa-dna',
    newRequestLink: '#',
    draftListLink: '#',
    trackListLink: '#',
    newImortedRequestLink: '#',
    draftImportedListLink: '#',
    trackImportedListLink: '#',
    dropdownLinks: {
      IMPORTATION_BIOLOGICAL: {
        link: '#',
        icon: 'fas fa-shipping-fast',
      },
      RELEASE_BIOLOGICAL: {
        link: '#',
        icon: 'fas fa-dolly-flatbed'
      }
    }
  },
  NARCOTICS: {
    baseLink: '#',
    baseIcon: 'fas fa-tablets',
    servicesIcon: 'fas fa-tablets',
    newRequestLink: '#',
    draftListLink: '#',
    trackListLink: '#',
    newImortedRequestLink: '#',
    draftImportedListLink: '#',
    trackImportedListLink: '#',
    dropdownLinks: {
      IMPORTATION_NARCOTICS: {
        link: '#',
        icon: 'fas fa-shipping-fast',
      },
      RELEASE_NARCOTICS: {
        link: '#',
        icon: 'fas fa-dolly-flatbed'
      }
    }
  },
  DETERGENTS_PESTICIDES: {
    baseLink: '/pages/pharmaceutical-raw-material',
    baseIcon: 'fas fa-pills',
    servicesIcon: 'fas fa-vials',
    newRequestLink: '#',
    draftListLink: '#',
    trackListLink: '#',
    newImortedRequestLink: '#',
    draftImportedListLink: '#',
    trackImportedListLink: '#',
    dropdownLinks: {
      IMPORTATION_DETERGENTS_PESTICIDES: {
        link: '#',
        icon: 'fas fa-shipping-fast',
      },
      RELEASE_DETERGENTS_PESTICIDES: {
        link: '#',
        icon: 'fas fa-dolly-flatbed'
      }
    }
  },
  COSMETICS: {
    baseLink: '/pages/cosmetics-product',
    baseIcon: 'fas fa-medkit',
    servicesIcon: 'fas fa-medkit',
    newRequestLink: '/pages/cosmetics-product/inner/new-request',
    draftListLink: '/pages/cosmetics-product/inner/draft-request',
    trackListLink: '/pages/cosmetics-product/inner/track-request',
    newImortedRequestLink: '/pages/cosmetics-product/inner/newImportedrequest',
    draftImportedListLink: '/pages/cosmetics-product/inner/draftImportedrequest',
    trackImportedListLink: '/pages/cosmetics-product/inner/trackImportedrequest',
    dropdownLinks: {
      IMPORTATION_COSMETICS: {
        link: '/pages/cosmetics-product/inner/importation-services',
        icon: 'fas fa-shipping-fast',
      },
      RELEASE_COSMETICS: {
        link: '/pages/cosmetics-product/inner/release-services',
        icon: 'fas fa-dolly-flatbed'
      },
      NEW_PREMIX: {
        link: '/pages/cosmetics-product/inner/premix-list',
        icon: 'fas fa-dolly-flatbed'
      }
    }
  },
  EXEMPTION: {
    baseLink: '#',
    baseIcon: 'fas fa-receipt',
    servicesIcon: 'fas fa-receipt',
    newRequestLink: '#',
    draftListLink: '#',
    trackListLink: '#',
    newImortedRequestLink: '#',
    draftImportedListLink: '#',
    trackImportedListLink: '#',
    dropdownLinks: {
      EXEMPTION: {
        link: '#',
        icon: 'fas fa-shipping-fast',
      }
    }
  }
};

export const commonKeysWithId: any = {
  1: 'RAW_MATERIALS',
  2: 'PHARMACEUTICAL_PRODUCTS',
  3: 'BIOLOGICAL',
  4: 'NARCOTICS',
  5: 'DETERGENTS_PESTICIDES',
  6: 'COSMETICS',
  7: 'EXEMPTION'
};

export const typeOfRequest = {
  "importation-services": "APPROVAL",
  "release-services": "CUSTOMS_RELEASE"
}
