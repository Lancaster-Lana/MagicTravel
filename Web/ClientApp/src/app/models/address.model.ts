import { AddressComponent } from "ngx-google-places-autocomplete/objects/addressComponent";
import { Geometry } from "ngx-google-places-autocomplete/objects/geometry";
import { OpeningHours } from "ngx-google-places-autocomplete/objects/openingHours";
import { Photo } from "ngx-google-places-autocomplete/objects/photo";
import { PlaceReview } from "ngx-google-places-autocomplete/objects/placeReview";

export class Address {
  public addressId: number = 0;
  //public orderId: number = 0;
  public country: string;
  public zipCode: string;
  public city: string;
  public state: string;
  public street: string;

  //NOTE: for location
  address_components: AddressComponent[];
  adr_address: string;
  formatted_address: string;
  formatted_phone_number: string;
  geometry: Geometry;
  html_attributions: string[];
  icon: string;
  id: string;
  international_phone_number: string;
  name: string;
  opening_hours: OpeningHours;
  permanently_closed: boolean;
  photos: Photo[];
  place_id: string;
  price_level: number;
  rating: number;
  reviews: PlaceReview[];
  types: string[];
  url: string;
  utc_offset: number;
  vicinity: string;
  website: string;
}
