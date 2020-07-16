package com.example.myshop;

import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Version;

import com.fasterxml.jackson.annotation.JsonIgnore;

// import lombok.Getter;
// import lombok.Setter;

@Entity
public class Product {

    // @Getter
    // @Setter
    private @Id @GeneratedValue Long id;
    // @Getter
    // @Setter
    private String name;
    // @Getter
    // @Setter
    private String description;

    private @Version @JsonIgnore Long version;

    // @Getter @Setter private String image;
    // @Getter @Setter private String[] detail;
    // @Getter @Setter private Double price;

    public Product() {
    }

    public Product(final String name, final String description) {
        this.name = name;
        this.description = description;
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, name, description);
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

    public void setname(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    // private Product (String name, String description, String image, String[]
    // detail; Double price){;}

    @Override
    public String toString() {
        return "Product{" + "id=" + id + ", name='" + name + '\'' + ", description='" + description + '\'' + '}';
    }

}
