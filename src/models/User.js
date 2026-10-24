export class User {
    constructor(
        id,
        email,
        passwordHash,
        createdAt = new Date()
    ) {
        this.id = id;
        this.email = email.trim().toLowerCase();
        this.passwordHash = passwordHash;
        this.createdAt = createdAt;
    }
}