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
package com.example.myshop.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Document(collection = "products")
public class Product {

	@Id
	private String id;
	private String name;
	private String summary;
	private Double price;
	private Double oldPrice;
	private String image;
	// private @Version @JsonIgnore Long version;



	public Product(String name, String summary, Double price, Double oldPrice, String image) {
		this.name = name;
		this.summary = summary;
		this.price = price;
		this.oldPrice = oldPrice;
		this.image = image;
	}

	public String getId() {
		return id;
	}

	// public Long getVersion() {
	// 	return version;
	// }

	// public void setVersion(Long version) {
	// 	this.version = version;
	// }

}
