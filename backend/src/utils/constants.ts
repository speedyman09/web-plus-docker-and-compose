import * as dotenv from 'dotenv';

dotenv.config();

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};

export const ANOTHER_USER_WITH_THIS_DATA =
  'Пользователь с такими данными уже существует';

export const USER_NOT_FOUND = 'Пользователя с такими данными не существует';

export const WISH_NOT_FOUND = 'Подарка с такими данными не существует';
export const INCORRECT_OWNER =
  'Нельзя редактировать или удалить чужой подарок или вишлист';
export const EDITING_WISH_PRICE_WITH_OFFERS_IS_FORBIDDEN =
  'Нельзя изменять цену подарка, на который уже есть желающие скинуться';
export const WISH_ALREADY_FUNDED =
  'На подарок набралось достаточно желающих скинуться';
export const WISH_ALREADY_COPIED = 'Вы уже копировали себе этот подарок';

export const WISHLIST_NOT_FOUND = 'Вишлиста с такими данными не существует';

export const OFFER_FROM_OWNER = 'Нельзя скинуться на собственный подарок';
export const OFFER_NOT_FOUND =
  'Предложения скинуться с такими данными не существует';
export const RAISED_MORE_THAN_PRICE =
  'Сумма собранных средств не может превышать стоимость подарка';

export const INTERNAL_SERVER_ERROR = 'Что-то пошло не так, попробуйте еще раз';
