package com.example.myshop.repo;

import com.example.myshop.domain.User;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "users", path = "users", exported = false)
public interface UserRepository extends MongoRepository<User, String> {

	// @Override
	// @PreAuthorize("hasRole('ROLE_ADMIN')")
	// User save(@Param("user") User user);

	// @Override
	// @PreAuthorize("hasRole('ROLE_ADMIN')")
	// void deleteById(@Param("id") String id);

	// @Override
	// @PreAuthorize("hasRole('ROLE_ADMIN')")
	// void delete(@Param("user") User user);

	// User save(User admin);
	// User findById(Long id);
	// User findByName(User name);
	User findByEmail(String email);

	User findByName(String name);
}