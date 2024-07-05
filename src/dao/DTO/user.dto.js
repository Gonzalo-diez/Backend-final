class UserDTO {
    constructor(first_name, last_name, email, age, password, profile, role = "user", documents) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.age = age;
        this.password = password;
        this.profile = profile;
        this.role = role;
        this.documents = documents;
    }
}

export default UserDTO;
