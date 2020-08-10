package com.example.myshop.repo;

import com.example.myshop.domain.Product;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

@RepositoryRestResource(collectionResourceRel = "products", path = "products")
public interface ProductRepository extends MongoRepository<Product, String> {

	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	Product save(@Param("product") Product product);

	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	void deleteById(@Param("id") String id);

	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	void delete(@Param("product") Product product);

}