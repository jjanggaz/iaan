
package com.iaan.kepco.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Data
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TreeDTO {

    private String id;
    private String parent;
    private String text;
    private String lvl;
    private String icon;


    @JsonProperty(value="a_attr")
    private String aAttr;

    public TreeDTO(String id, String parent, String text, String aAttr, String icon) {
        this.id = id;
        this.parent = parent;
        this.text = text;
        this.lvl = lvl;
        this.aAttr = aAttr;
        this.icon = icon;
    }
}
