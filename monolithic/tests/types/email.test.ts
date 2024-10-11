import { equal, notEqual } from 'assert';
import Email from '../../src/types/email';

describe('Email domain object', () => {
  it('should be able to create an email with valid data', async () => {
    const emailString = 'test@test.fr';
    const email = new Email(emailString);
    equal(email.getEmail(), emailString);
  });

  it('should fail if email is invalid', async () => {
    let error: any = null;
    try {
      new Email('invalid@email');
    } catch (e) {
      error = e;
    }
    notEqual(error, null);
    equal(error.message, 'Invalid email');

    error = null;
    try {
      new Email('');
    } catch (e) {
      error = e;
    }
    notEqual(error, null);
    equal(error.message, 'Invalid email');
  });
});
