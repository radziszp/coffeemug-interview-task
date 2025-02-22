import { isHoliday } from 'poland-public-holidays';
import { Category, IProduct } from '../models/productModel';

export enum CustomerLocation {
  EUROPE = 'Europe',
  US = 'US',
  ASIA = 'Asia'
}

export interface DiscountProduct extends IProduct {
  quantity: number;
}

export class ProductDiscountHelper {
  private products;
  private location;

  constructor(products: DiscountProduct[], location: CustomerLocation) {
    this.products = products;
    this.location = location;
  }

  promotionalCategories = [Category.HOME, Category.SPORTS];

  getBestTotalPrice() {
    let volumeBasedPrice = 0;
    let seasonalBasedPrice = 0;
    let locationBasedPrice = 0;
    for (let product of this.products) {
      volumeBasedPrice += this.calculateVolumeDiscountPrice(product);
      seasonalBasedPrice += this.calculateSeasonalDiscountPrice(product);
      locationBasedPrice += this.calculateLocationDiscountPrice(product);
    }

    return Math.min(volumeBasedPrice, seasonalBasedPrice, locationBasedPrice);
  }

  calculateVolumeDiscountPrice(product: DiscountProduct) {
    if (product.quantity >= 50) {
      return Math.round(product.price * 0.7 * product.quantity);
    }
    if (product.quantity >= 10) {
      return Math.round(product.price * 0.8 * product.quantity);
    }
    if (product.quantity >= 5) {
      return Math.round(product.price * 0.9 * product.quantity);
    }

    return Math.round(product.price * product.quantity);
  }

  calculateSeasonalDiscountPrice(product: DiscountProduct) {
    if (this.isBlackFriday()) {
      return Math.round(product.price * 0.75 * product.quantity);
    }
    if (
      isHoliday(new Date()) &&
      this.promotionalCategories.includes(product.category)
    ) {
      return Math.round(product.price * 0.85 * product.quantity);
    }

    return Math.round(product.price * product.quantity);
  }

  calculateLocationDiscountPrice(product: DiscountProduct) {
    switch (this.location) {
      case CustomerLocation.ASIA: {
        return Math.round(product.price * 0.95 * product.quantity);
      }
      case CustomerLocation.EUROPE: {
        return Math.round(product.price * 1.15 * product.quantity);
      }
      case CustomerLocation.US:
      default: {
        return Math.round(product.price * product.quantity);
      }
    }
  }

  isBlackFriday(dateParam?: Date): boolean {
    const date = dateParam ? dateParam : new Date();
    if (date.getMonth() !== 10 || date.getDay() !== 5) {
      return false;
    }
  
    let lastDayOfNovember = new Date(date.getFullYear(), 11, 0);
        while (lastDayOfNovember.getDay() !== 5) {
      lastDayOfNovember.setDate(lastDayOfNovember.getDate() - 1);
    }
  
    return date.getDate() === lastDayOfNovember.getDate();
  }
}
