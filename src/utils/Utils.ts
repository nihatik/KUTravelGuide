export class Utils {
    /**
     * Округляет число до заданного количества знаков после запятой.
     * @param value - число для округления
     * @param digits - количество знаков после запятой (по умолчанию 2)
     */
    static toFixedNumber(value: number, digits: number = 2): number {
        return Number(value.toFixed(digits));
    }

    /**
     * Возвращает расстояние между двумя точками.
     */
    static distance(x1: number, z1: number, x2: number, z2: number): number {
        return Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
    }

    /**
     * Проверяет, равны ли два числа с учетом погрешности.
     */
    static nearlyEqual(a: number, b: number, epsilon: number = 0.001): boolean {
        return Math.abs(a - b) < epsilon;
    }
}