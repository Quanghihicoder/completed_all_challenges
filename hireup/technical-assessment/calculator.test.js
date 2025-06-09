import calculator from './calculator';

const roundToTwoDecimal = (number) => {
  return parseFloat(number.toFixed(2))
}

describe('calculator', () => {
  test('same day, weekday, day time increment of 15', () => {
    const input = [{
      "id": 1,
      "from": "2025-06-04T06:15:00+11:00",
      "to": "2025-06-04T10:30:00+11:00"
    }];

    expect(calculator(input)).toEqual([{
      "id": 1,
      "from": "2025-06-04T06:15:00+11:00",
      "to": "2025-06-04T10:30:00+11:00",
      "isValid": true,
      "total": roundToTwoDecimal(38 * 4.25)
    }]);
  });

  test('same day, weekday, day time', () => {
    const input = [{
      "id": 1,
      "from": "2025-06-04T06:00:00+11:00",
      "to": "2025-06-04T20:00:00+11:00"
    }];

    expect(calculator(input)).toEqual([{
      "id": 1,
      "from": "2025-06-04T06:00:00+11:00",
      "to": "2025-06-04T20:00:00+11:00",
      "isValid": true,
      "total": roundToTwoDecimal(38 * 14)
    }]);
  });

  test('same day, weekday, day time, different timezone', () => {
    const input = [{
      "id": 1,
      "from": "2025-06-04T06:00:00-11:00",
      "to": "2025-06-04T20:00:00-11:00"
    }];

    expect(calculator(input)).toEqual([{
      "id": 1,
      "from": "2025-06-04T06:00:00-11:00",
      "to": "2025-06-04T20:00:00-11:00", 
      "isValid": true,
      "total": roundToTwoDecimal(38 * 14)
    }]);
  });

  test('same day, weekday, night time', () => {
    const input = [{
      "id": 1,
      "from": "2025-06-04T20:00:00+11:00",
      "to": "2025-06-04T22:00:00+11:00" 
    }];

    expect(calculator(input)).toEqual([{
      "id": 1,
      "from": "2025-06-04T20:00:00+11:00",
      "to": "2025-06-04T22:00:00+11:00", 
      "isValid": true,
      "total": roundToTwoDecimal(42.93 * 2)
    }]);
  });

  test('same day, saturday', () => {
    const input = [{
      "id": 1,
      "from": "2025-05-31T20:00:00+11:00",
      "to": "2025-05-31T22:00:00+11:00"
    }];

    expect(calculator(input)).toEqual([{
      "id": 1,
      "from": "2025-05-31T20:00:00+11:00",
      "to": "2025-05-31T22:00:00+11:00", 
      "isValid": true,
      "total": roundToTwoDecimal(45.91 * 2)
    }]);
  });

  test('same day, sunday', () => {
    const input = [{
      "id": 1,
      "from": "2025-06-01T02:00:00-11:00",
      "to": "2025-06-01T22:00:00-11:00"
    }];

    expect(calculator(input)).toEqual([{
      "id": 1,
      "from": "2025-06-01T02:00:00-11:00",
      "to": "2025-06-01T22:00:00-11:00", 
      "isValid": true,
      "total": roundToTwoDecimal(60.85 * 20)
    }]);
  });

  test('diff day, weekday', () => {
    const input = [{
      "id": 1,
      "from": "2025-06-03T10:00:00+11:00",
      "to": "2025-06-04T05:00:00+11:00"
    }];

    expect(calculator(input)).toEqual([{
      "id": 1,
      "from": "2025-06-03T10:00:00+11:00",
      "to": "2025-06-04T05:00:00+11:00", 
      "isValid": true,
      "total": roundToTwoDecimal(42.93 * 19)
    }]);
  });

  test('diff day, saturday to sunday', () => {
    const input = [{
      "id": 1,
      "from": "2025-05-31T22:00:00+11:00",
      "to": "2025-06-01T04:00:00+11:00"
    }];

    expect(calculator(input)).toEqual([{
      "id": 1,
      "from": "2025-05-31T22:00:00+11:00",
      "to": "2025-06-01T04:00:00+11:00", 
      "isValid": true,
      "total": roundToTwoDecimal(45.91 * 2 + 60.85 * 4)
    }]);
  });

  test('diff day, sunday to monday', () => {
    const input = [{
      "id": 1,
      "from": "2025-06-01T22:00:00+11:00",
      "to": "2025-06-02T04:00:00+11:00"
    }];

    expect(calculator(input)).toEqual([{
      "id": 1,
      "from": "2025-06-01T22:00:00+11:00",
      "to": "2025-06-02T04:00:00+11:00", 
      "isValid": true,
      "total":  roundToTwoDecimal(60.85 * 2 + 42.93 * 4)
    }]);
  });

  test('diff timezone', () => {
    const input = [{
      "id": 1,
      "from": "2025-06-01T22:00:00-11:00",
      "to": "2025-06-02T04:00:00+11:00"
    }];

    expect(calculator(input)).toEqual([{
      "id": 1,
      "from": "2025-06-01T22:00:00-11:00",
      "to": "2025-06-02T04:00:00+11:00", 
      "isValid": false,
      "total":  0
    }]);
  });


  test('not increment of 15', () => {
    const input = [{
      "id": 1,
      "from": "2025-06-02T6:00:00+11:00",
      "to": "2025-06-02T07:10:00+11:00"
    }];

    expect(calculator(input)).toEqual([{
      "id": 1,
      "from": "2025-06-02T6:00:00+11:00",
      "to": "2025-06-02T07:10:00+11:00", 
      "isValid": false,
      "total":  0
    }]);
  });

  test('less than 1 hour', () => {
    const input = [{
      "id": 1,
      "from": "2025-06-02T6:00:00+11:00",
      "to": "2025-06-02T06:45:00+11:00"
    }];

    expect(calculator(input)).toEqual([{
      "id": 1,
      "from": "2025-06-02T6:00:00+11:00",
      "to": "2025-06-02T06:45:00+11:00", 
      "isValid": false,
      "total":  0
    }]);
  });

  test('more than 1 day', () => {
    const input = [{
      "id": 1,
      "from": "2025-06-02T6:00:00+11:00",
      "to": "2025-06-03T07:00:00+11:00"
    }];

    expect(calculator(input)).toEqual([{
      "id": 1,
      "from": "2025-06-02T6:00:00+11:00",
      "to": "2025-06-03T07:00:00+11:00", 
      "isValid": false,
      "total":  0
    }]);
  });

  test('end before', () => {
    const input = [{
      "id": 1,
      "from": "2025-06-02T8:00:00+11:00",
      "to": "2025-06-02T06:00:00+11:00"
    }];

    expect(calculator(input)).toEqual([{
      "id": 1,
      "from": "2025-06-02T8:00:00+11:00",
      "to": "2025-06-02T06:00:00+11:00", 
      "isValid": false,
      "total":  0
    }]);
  });
});
