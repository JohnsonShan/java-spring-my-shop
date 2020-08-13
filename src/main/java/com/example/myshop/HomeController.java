/*
 * Copyright 2015 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.example.myshop;

import com.example.myshop.storage.StorageFileNotFoundException;
import com.example.myshop.storage.StorageService;
import com.example.myshop.repo.UserRepository;
import com.example.myshop.domain.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

// tag::code[]
@Controller // <1>
public class HomeController {

	@Autowired
	UserRepository UserRepository;

	private final StorageService storageService;

	@Autowired
	public HomeController(StorageService storageService) {
		this.storageService = storageService;
	}

	@RequestMapping(value = "/") // <2>
	public String index() {
		return "index"; // <3>
	}

	@PostMapping("/signup")
	public String signup(@RequestParam("username") String username, @RequestParam("password") String password,
			@RequestParam("email") String email, RedirectAttributes redirectAttributes) {

		if (UserRepository.findByEmail(email) == null) {
			UserRepository.save(new User(username, password, email));
			redirectAttributes.addFlashAttribute("message", "You successfully sign-up !");

			return "redirect:/sign_up_success";
		} 
		// else {
		// 	redirectAttributes.addFlashAttribute("message", "You unsuccessfully sign-up !");
		// 	return "redirect:/email_already_exist";
		// }

		redirectAttributes.addFlashAttribute("message", "You unsuccessfully sign-up !");
		return "redirect:/email_already_exist";

	}
	// @RequestMapping(value="/sign-in")
	// public String signin(){
	// return "sign-in";
	// }
	// @RequestMapping(value="/sign-up")
	// public String signup(){
	// return "sign-up";
	// }

	@PostMapping("/uploadPhoto")
	public String handleFileUpload(@RequestParam("file") MultipartFile file, RedirectAttributes redirectAttributes) {

		storageService.store(file);
		redirectAttributes.addFlashAttribute("message",
				"You successfully uploaded " + file.getOriginalFilename() + "!");

		return "redirect:/#";
	}

	@ExceptionHandler(StorageFileNotFoundException.class)
	public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc) {
		return ResponseEntity.notFound().build();
	}
}
// end::code[]
