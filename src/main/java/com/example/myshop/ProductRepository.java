package com.example.myshop;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.prepost.PreAuthorize;

// @PreAuthorize("hasRole('ROLE_MANAGER')")
public interface ProductRepository extends PagingAndSortingRepository<Product, Long> { // <1>

    @Override
	@PreAuthorize("#product?.manager == null or #product?.manager?.name == authentication?.name")
	Product save(@Param("product") Product product);

	@Override
	@PreAuthorize("@productRepository.findById(#id)?.manager?.name == authentication?.name")
	void deleteById(@Param("id") Long id);

	@Override
	@PreAuthorize("#product?.manager?.name == authentication?.name")
    void delete(@Param("product") Product product);
    
}