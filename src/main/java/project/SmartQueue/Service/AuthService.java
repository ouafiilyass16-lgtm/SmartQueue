package project.SmartQueue.Service;



import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import project.SmartQueue.Repository.UserRepository;
import project.SmartQueue.Security.JwtService;
import project.SmartQueue.dto.LoginRequest;
import project.SmartQueue.dto.LoginResponse;
import project.SmartQueue.dto.RegisterRequest;
import project.SmartQueue.model.Role;
import project.SmartQueue.model.User;

@Service
public class AuthService {
private UserRepository userRepository;
private final PasswordEncoder passwordEncoder;
private JwtService jwtService;
public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,JwtService jwtService) {
	this.jwtService=jwtService;
	this.userRepository = userRepository;
	this.passwordEncoder = passwordEncoder;
}
public User register(RegisterRequest request) {
	if(userRepository.existsByEmail(request.email())) {
		throw new RuntimeException("email already existes");
	}
	User user=User.builder()
			      .firstName(request.firstName())
			      .lastName(request.lastName())
			      .email(request.email())
			      .password(passwordEncoder.encode(request.password()))
			      .role(Role.CLIENT)
		     	.build();
	return userRepository.save(user);
}
public LoginResponse login(LoginRequest request) {

    User user = userRepository.findByEmail(request.email())
            .orElseThrow(() ->
                    new RuntimeException("Utilisateur introuvable"));

    boolean passwordCorrect =
            passwordEncoder.matches(
                    request.password(),
                    user.getPassword()
            );

    if (!passwordCorrect) {
        throw new RuntimeException("Invalid password");
    }

    String token =
            jwtService.generateToken(user.getEmail());

    return new LoginResponse(
            token,
            user.getEmail(),
            user.getRole().name()
    );
}

}
