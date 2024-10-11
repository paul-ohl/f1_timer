import EmailValidator from 'email-validator';

class Email {
  private email: string;

  constructor(email: string) {
    if (!EmailValidator.validate(email)) {
      throw new Error('Invalid email');
    }
    this.email = email;
  }

  public getEmail(): string {
    return this.email;
  }
}

export default Email;
