package com.artisans.dto;

public class StoryDto {

    private Integer id;
    private Integer artisanId;
    private String artisanName;

    private String title;
    private String content;

    private String mediaUrl;
    private Integer views;

    public StoryDto(
            Integer id,
            Integer artisanId,
            String artisanName,
            String title,
            String content,
            String mediaUrl,
            Integer views
    ) {
        this.id = id;
        this.artisanId = artisanId;
        this.artisanName = artisanName;
        this.title = title;
        this.content = content;
        this.mediaUrl = mediaUrl;
        this.views = views;
    }

    public Integer getId() { return id; }
    public Integer getArtisanId() { return artisanId; }
    public String getArtisanName() { return artisanName; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public String getMediaUrl() { return mediaUrl; }
    public Integer getViews() { return views; }
}
