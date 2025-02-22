import * as publicHolidays from 'poland-public-holidays';
import {
  CustomerLocation,
  DiscountProduct,
  ProductDiscountHelper
} from './productDiscountsHelper';
import { Category } from '../models/productModel';

describe('ProductDiscountsHelper', () => {
  let productDiscountsHelper: ProductDiscountHelper;

  beforeEach(() => {
    productDiscountsHelper = new ProductDiscountHelper(
      [],
      CustomerLocation.ASIA
    );
  });

  describe('calculateVolumeDiscountPrice', () => {
    it.each([
      [{ price: 100, quantity: 50 } as DiscountProduct, 3500],
      [{ price: 200, quantity: 50 } as DiscountProduct, 7000],
      [{ price: 100, quantity: 10 } as DiscountProduct, 800],
      [{ price: 150, quantity: 10 } as DiscountProduct, 1200],
      [{ price: 100, quantity: 5 } as DiscountProduct, 450],
      [{ price: 250, quantity: 5 } as DiscountProduct, 1125],
      [{ price: 100, quantity: 3 } as DiscountProduct, 300],
      [{ price: 500, quantity: 1 } as DiscountProduct, 500]
    ])(
      'should return %i for product %o',
      (product: DiscountProduct, expectedPrice: number) => {
        const finalPrice =
          productDiscountsHelper.calculateVolumeDiscountPrice(product);

        expect(finalPrice).toBe(expectedPrice);
      }
    );
  });

  describe('calculateSeasonalDiscountPrice', () => {
    it.each([
      [
        {
          price: 100,
          category: Category.ELECTRONICS,
          quantity: 2
        } as DiscountProduct,
        150
      ],
      [
        {
          price: 200,
          category: Category.HOME,
          quantity: 2
        } as unknown as DiscountProduct,
        300
      ]
    ])(
      'should apply 25% Black Friday discount to %o',
      (product, expectedPrice) => {
        jest
          .spyOn(productDiscountsHelper, 'isBlackFriday')
          .mockReturnValue(true);

        const finalPrice =
          productDiscountsHelper.calculateSeasonalDiscountPrice(product);

        expect(finalPrice).toBe(expectedPrice);
      }
    );

    it.each([
      [
        {
          price: 100,
          category: Category.ELECTRONICS,
          quantity: 2
        } as DiscountProduct,
        200
      ],
      [
        {
          price: 300,
          category: Category.HOME,
          quantity: 2
        } as unknown as DiscountProduct,
        510
      ]
    ])('should apply 15% Holiday discount to %o', (product, expectedPrice) => {
      jest
        .spyOn(productDiscountsHelper, 'isBlackFriday')
        .mockReturnValue(false);
      jest.spyOn(publicHolidays, 'isHoliday').mockReturnValue(true);

      const finalPrice =
        productDiscountsHelper.calculateSeasonalDiscountPrice(product);

      expect(finalPrice).toBe(expectedPrice);
    });

    it.each([
      [
        {
          price: 100,
          category: 'Clothing',
          quantity: 2
        } as unknown as DiscountProduct,
        200
      ],
      [
        {
          price: 250,
          category: 'Furniture',
          quantity: 2
        } as unknown as DiscountProduct,
        500
      ]
    ])('should not apply any discount to %o', (product, expectedPrice) => {
      jest
        .spyOn(productDiscountsHelper, 'isBlackFriday')
        .mockReturnValue(false);
      jest.spyOn(publicHolidays, 'isHoliday').mockReturnValue(false);

      const finalPrice =
        productDiscountsHelper.calculateSeasonalDiscountPrice(product);

      expect(finalPrice).toBe(expectedPrice);
    });
  });

  describe('calculateLocationDiscountPrice', () => {
    it.each([
      [
        CustomerLocation.ASIA,
        { price: 100, quantity: 2 } as DiscountProduct,
        190
      ],
      [
        CustomerLocation.ASIA,
        { price: 200, quantity: 2 } as DiscountProduct,
        380
      ],
      [
        CustomerLocation.EUROPE,
        { price: 100, quantity: 2 } as DiscountProduct,
        230
      ],
      [
        CustomerLocation.EUROPE,
        { price: 300, quantity: 2 } as DiscountProduct,
        690
      ],
      [
        CustomerLocation.US,
        { price: 100, quantity: 2 } as DiscountProduct,
        200
      ],
      [CustomerLocation.US, { price: 250, quantity: 2 } as DiscountProduct, 500]
    ])(
      'should apply correct location-based price for location %s and product %o',
      (location, product: DiscountProduct, expectedPrice) => {
        const productDiscountsHelper = new ProductDiscountHelper(
          [product],
          location
        );
        const finalPrice =
          productDiscountsHelper.calculateLocationDiscountPrice(product);

        expect(finalPrice).toBe(expectedPrice);
      }
    );
  });

  describe('isBlackFriday', () => {
    it.each([
      [new Date(Date.UTC(2023, 10, 24)), true],
      [new Date(Date.UTC(2024, 10, 29)), true],
      [new Date(Date.UTC(2025, 10, 28)), true],
      [new Date(Date.UTC(2024, 10, 22)), false]
    ])(
      'should return %s for date %o',
      (date: Date, expectedResult: boolean) => {
        const result = productDiscountsHelper.isBlackFriday(date);

        expect(result).toBe(expectedResult);
      }
    );
  });

  describe('getBestTotalPrice', () => {
    it('should return lowest price', () => {
      const productDiscountsHelper = new ProductDiscountHelper(
        [{ price: 100 } as DiscountProduct],
        CustomerLocation.ASIA
      );
      jest
        .spyOn(productDiscountsHelper, 'calculateVolumeDiscountPrice')
        .mockReturnValue(15);
      jest
        .spyOn(productDiscountsHelper, 'calculateSeasonalDiscountPrice')
        .mockReturnValue(20);
      jest
        .spyOn(productDiscountsHelper, 'calculateLocationDiscountPrice')
        .mockReturnValue(25);

      const result = productDiscountsHelper.getBestTotalPrice();

      expect(result).toBe(15);
    });
  });
});
