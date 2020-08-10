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
package com.example.myshop.entity;

import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
// import javax.persistence.ManyToOne;
import javax.persistence.Version;

import com.fasterxml.jackson.annotation.JsonIgnore;

// import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "products")
public class Product {

	private @Id @GeneratedValue Long id;
	private String name;
	private String description;
	private Double price;
	private Double oldPrice;

	private String image;



		public Product(String name, String description, Double price, Double oldPrice, String image) { 
		this.name = name;
		this.description = description;
		this.price = price;
		this.oldPrice = oldPrice;
		this.image = image;
	}





	@Override
	public String toString() {
		return "Product{" +
			"id=" + id +
			", name='" + name + '\'' +
			", description='" + description + '\'' +
			", price='" + price +'\'' +
			", oldPrice='" + oldPrice + '\'' +
			", img='" + img + '\'' +
			// ", version=" + version +
			'}';
	}
}
// end::code[]
