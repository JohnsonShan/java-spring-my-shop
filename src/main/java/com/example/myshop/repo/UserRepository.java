package com.example.myshop.repo;

import com.example.myshop.domain.User;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

@RepositoryRestResource(collectionResourceRel = "users", path = "users")
public interface UserRepository extends MongoRepository<User, String> {

	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	User save(@Param("user") User user);

	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	void deleteById(@Param("id") String id);

	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	void delete(@Param("user") User user);

}