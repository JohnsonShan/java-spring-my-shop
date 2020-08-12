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
package com.example.myshop.security;

import com.example.myshop.domain.User;
import com.example.myshop.repo.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
// import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;


// tag::code[]
@Component
public class SpringDataJpaUserDetailsService implements UserDetailsService {

	@Autowired
	UserRepository UserRepository;

	// @Override
	// public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
		
	// 	return UserRepository;
	// }

	// private final AdminRepository repository;

	// @Autowired
	// public SpringDataJpaUserDetailsService(AdminRepository repository) {
	// 	this.repository = repository;
	// }

	@Override
	public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
		User User = UserRepository.findByName(name);
		return new org.springframework.security.core.userdetails.User(User.getName(), User.getPassword(),
				AuthorityUtils.createAuthorityList(User.getRoles()));
	}

}
// end::code[]
