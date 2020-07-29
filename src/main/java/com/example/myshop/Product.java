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

import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Version;

import com.fasterxml.jackson.annotation.JsonIgnore;


// tag::code[]
@Entity
public class Product {

	private @Id @GeneratedValue Long id;
	private String name;
	private String description;
	private Double price;
	private Double oldPrice;

	private String img;

	private @Version @JsonIgnore Long version;

	private @ManyToOne Manager manager; // <1>

	private Product() {}

	public Product(String name, String description, Manager manager, Double price, Double oldPrice, String img) { // <2>
		this.name = name;
		this.description = description;
		this.manager = manager;
		this.price = price;
		this.oldPrice = oldPrice;
		this.img = img;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Product product = (Product) o;
		return Objects.equals(id, product.id);
	}


	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Double getPrice(){
		return price;
	}
	public void setPrice(Double price){
		this.price = price;
	}
	public Double getOldPrice(){
		return oldPrice;
	}
	public void setOldPrice(Double oldPrice){
		this.oldPrice = oldPrice;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getImg() {
		return img;
	}

	public void setImg(String img) {
		this.img = img;
	}


	public Long getVersion() {
		return version;
	}

	public void setVersion(Long version) {
		this.version = version;
	}

	public Manager getManager() {
		return manager;
	}

	public void setManager(Manager manager) {
		this.manager = manager;
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
			", version=" + version +
			", manager=" + manager +
			'}';
	}
}
// end::code[]
