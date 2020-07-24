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

		for (int i = 1; i < 6; i++) {
			this.repository.save(new Product("pizza" + i, "pizza" + i, johnson, (double) 100 + i + 0.9,
					(double) 200 + i + 0.9, "pizza" + i + ".jpg"));
		}
		for (int i = 1; i < 6; i++) {
			this.repository.save(new Product("pasta" + i, "pasta" + i, johnson, (double) 100 + i + 0.9,
					(double) 200 + i + 0.9, "pasta" + i + ".jpg"));
		}
		for (int i = 1; i < 6; i++) {
			this.repository.save(new Product("risotto" + i, "risotto" + i, johnson, (double) 100 + i + 0.9,
					(double) 200 + i + 0.9, "risotto" + i + ".jpg"));
		}
		for (int i = 1; i < 6; i++) {
			this.repository.save(new Product("burger" + i, "burger" + i, johnson, (double) 100 + i + 0.9,
					(double) 200 + i + 0.9, "burger" + i + ".jpg"));
		}
		SecurityContextHolder.clearContext();
	}
}
// end::code[]
