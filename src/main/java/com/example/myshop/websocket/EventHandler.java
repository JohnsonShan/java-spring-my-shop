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
package com.example.myshop.websocket;

import static com.example.myshop.websocket.WebSocketConfiguration.MESSAGE_PREFIX;

import com.example.myshop.domain.Product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;


// tag::code[]
@Component
@RepositoryEventHandler(Product.class) // <1>
public class EventHandler {

	private final SimpMessagingTemplate websocket; // <2>

	private final EntityLinks entityLinks;

	@Autowired
	public EventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
		this.websocket = websocket;
		this.entityLinks = entityLinks;
	}

	@HandleAfterCreate // <3>
	public void newProduct(Product product) {
		this.websocket.convertAndSend(MESSAGE_PREFIX + "/newProduct", getPath(product));
	}

	@HandleAfterDelete // <3>
	public void deleteProduct(Product product) {
		this.websocket.convertAndSend(MESSAGE_PREFIX + "/deleteProduct", getPath(product));
	}

	@HandleAfterSave // <3>
	public void updateProduct(Product product) {
		this.websocket.convertAndSend(MESSAGE_PREFIX + "/updateProduct", getPath(product));
	}

	/**
	 * Take an {@link Employee} and get the URI using Spring Data REST's
	 * {@link EntityLinks}.
	 *
	 * @param product
	 */
	private String getPath(Product product) {
		return this.entityLinks.linkForItemResource(product.getClass(), product.getId()).toUri().getPath();
	}

}
// end::code[]
