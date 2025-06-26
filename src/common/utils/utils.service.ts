import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
	private constructor() {}

	/**
	 * Форматирует строку в camelCase
	 * @example "hello_world" → "helloWorld"
	 */
	public static toCamelCase(str: string): string {
		return str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
	}

	/**
	 * Генерирует UUID (версия 4)
	 */
	public static generateUUIDv4(): string {
		return crypto.randomUUID(); // Встроенный API в современных браузерах/Node.js
	}

	// --- Date Utilities ---
	/**
	 * Форматирует дату в читаемый вид
	 * @example new Date() → "2023-05-15 14:30"
	 */
	public static formatDate(date: Date, includeTime = true): string {
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			...(includeTime && {
				hour: '2-digit',
				minute: '2-digit',
			}),
		};
		return new Intl.DateTimeFormat('ru-RU', options).format(date);
	}

	// --- Object Utilities ---
	/**
	 * Глубокое клонирование объекта
	 */
	public static deepClone<T>(obj: T): T {
		return structuredClone(obj);
	}

	/**
	 * Удаляет undefined/null полей из объекта
	 */
	public static removeEmptyFields<T extends object>(obj: T): Partial<T> {
		return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null)) as Partial<T>;
	}

	// --- Array Utilities ---
	/**
	 * Разделяет массив на чанки
	 * @example chunk([1,2,3,4], 2) → [[1,2], [3,4]]
	 */
	public static chunk<T>(array: T[], size: number): T[][] {
		return Array.from({ length: Math.ceil(array.length / size) }, (_, i) => array.slice(i * size, i * size + size));
	}

	// --- Async Utilities ---
	/**
	 * Задержка выполнения (sleep)
	 */
	public static async sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	// --- Validation Utilities ---
	/**
	 * Проверяет, является ли значение валидным JSON
	 */
	public static isJSON(str: string): boolean {
		try {
			JSON.parse(str);
			return true;
		} catch {
			return false;
		}
	}
	public static isEmail(str: unknown): boolean {
		if (typeof str !== 'string') return false;
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(str);
	}

	/**
	 * Оценка сложности пароля
	 * @param password
	 */
	public checkPasswordQuality(password: string): boolean {
		if (password.length < 7) {
			return false;
		}
		const symbols = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '0123456789', '!"№~$#%:&*()_-+=\/!\''];
		const matches = [0, 0, 0, 0];
		for (const char of password.split('')) {
			for (let n = 0; n < 4; n++) {
				if (symbols[n].indexOf(char) !== -1) {
					matches[n]++;
				}
			}
		}
		return matches.indexOf(0) === -1;
	}

	/**
	 * Секрето-генератор
	 * @param length
	 * @param chars
	 */
	public enygma(length: number, chars: string) {
		let mask = '';
		let result = '';
		if (chars.indexOf('a') > -1) {
			mask += 'abcdefghijklmnopqrstuvwxyz';
		}
		if (chars.indexOf('A') > -1) {
			mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		}
		if (chars.indexOf('#') > -1) {
			mask += '0123456789';
		}
		if (chars.indexOf('!') > -1) {
			mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
		}
		for (let i = length; i > 0; --i) {
			result += mask[Math.floor(Math.random() * mask.length)];
		}
		return result;
	}
}
