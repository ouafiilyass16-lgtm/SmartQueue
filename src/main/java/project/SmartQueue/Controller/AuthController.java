package project.SmartQueue.Controller;





import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import project.SmartQueue.Service.AuthService;
import project.SmartQueue.dto.LoginRequest;
import project.SmartQueue.dto.RegisterRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
 private AuthService authService;
 public AuthController(AuthService authService) {
	this.authService = authService;
 }
 @PostMapping("/login")
 public ResponseEntity<?> login(
         @RequestBody LoginRequest requestLogin) {

     return ResponseEntity.ok(
             authService.login(requestLogin)
     );
 }
 
 @PostMapping("/register")
 public ResponseEntity<?> register(@RequestBody RegisterRequest requestRegister){
	 return ResponseEntity.ok(authService.register(requestRegister) );
 }
	
	
}
