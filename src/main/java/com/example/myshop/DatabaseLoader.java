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

import com.example.myshop.domain.Admin;
import com.example.myshop.domain.Product;
import com.example.myshop.repo.AdminRepository;
import com.example.myshop.repo.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

// tag::code[]
@Component // <1>
public class DatabaseLoader implements CommandLineRunner { // <2>

	// private final ProductRepository ProductRepository;
	// private final ManagerRepository ManagerRepository;

	// @Autowired // <3>
	// public DatabaseLoader(final ProductRepository ProductRepository,
	// ManagerRepository ManagerRepository) {
	// this.ProductRepository = ProductRepository;
	// this.ManagerRepository = ManagerRepository;
	// }

	@Autowired
	AdminRepository AdminRepository;

	@Autowired
	ProductRepository ProductRepository;

	@Override
	public void run(final String... strings) throws Exception { // <4>

		deleteAll();
		addSampleData();
		listAll();
	}

	public void deleteAll() {
		System.out.println("Deleting all records..");
		ProductRepository.deleteAll();
	}

	public void addSampleData() {
		System.out.println("Adding sample data");

		Admin johnson = AdminRepository.save(new Admin("johnson", "johnsonabcd", "ROLE_ADMIN"));

		SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("johnson",
				"doesn't matter", AuthorityUtils.createAuthorityList("ROLE_ADMIN")));

		for (int i = 1; i < 6; i++) {
			ProductRepository.save(new Product("pasta" + i, "description" + i, (double) 100 + i + 0.9,
					(double) 200 + i + 0.9, "/images/pasta" + i + ".jpg"));
		}

		for (int i = 1; i < 6; i++) {
			ProductRepository.save(new Product("risotto" + i, "description" + i, (double) 100 + i + 0.9,
					(double) 200 + i + 0.9, "/images/risotto" + i + ".jpg"));
		}

		for (int i = 1; i < 6; i++) {
			ProductRepository.save(new Product("pizza" + i, "description" + i, (double) 100 + i + 0.9,
					(double) 200 + i + 0.9, "/images/pizza" + i + ".jpg"));
		}

		for (int i = 1; i < 6; i++) {
			ProductRepository.save(new Product("burger" + i, "description" + i, (double) 100 + i + 0.9,
					(double) 200 + i + 0.9, "/images/burger" + i + ".jpg"));
		}
		SecurityContextHolder.clearContext();

	}

	public void listAll() {
		System.out.println("Listing sample data");
		ProductRepository.findAll().forEach(u -> System.out.println(u));
	}

}
// end::code[]
