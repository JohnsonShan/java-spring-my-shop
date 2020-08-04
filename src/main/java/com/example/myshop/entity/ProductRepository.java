package com.example.myshop.entity;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.prepost.PreAuthorize;

public interface ProductRepository extends PagingAndSortingRepository<Product, Long> { // <1>

	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	Product save(@Param("product") Product product);

	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	void deleteById(@Param("id") Long id);

	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
    void delete(@Param("product") Product product);
    
}