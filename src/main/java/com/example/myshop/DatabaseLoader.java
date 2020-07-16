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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

// tag::code[]
@Component // <1>
public class DatabaseLoader implements CommandLineRunner { // <2>

	private final ProductRepository repository;
	private final ManagerRepository managers;

	@Autowired // <3>
	public DatabaseLoader(final ProductRepository repository, ManagerRepository managerRepository) {
		this.repository = repository;
		this.managers = managerRepository;
	}

	@Override
	public void run(final String... strings) throws Exception { // <4>
		Manager johnson = this.managers.save(new Manager("johnson", "johnsonabcd", "ROLE_MANAGER"));

		SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("johnson",
				"doesn't matter", AuthorityUtils.createAuthorityList("ROLE_MANAGER")));

		for (int i = 0; i < 20; i++) {
			this.repository.save(new Product("myProduct" + i, "testing" + i, johnson));
		}
		SecurityContextHolder.clearContext();
	}
}
// end::code[]
