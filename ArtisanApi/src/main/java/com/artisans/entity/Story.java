package com.artisans.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "stories")
public class Story {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /* Story belongs only to artisan */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "artisan_id", nullable = false)
    private ArtisanProfile artisan;

    /* Optional title */
    @Column(length = 200)
    private String title;

    /* Written story (journey, craft, product narrative, etc.) */
    @Lob
    @Column(columnDefinition = "TEXT")
    private String content;

    /* Optional media (image/video) */
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] media;

    /* image/jpeg, video/mp4 (nullable if text-only) */
    private String mediaType;

    @Column(nullable = false)
    private Integer views = 0;

    /* ================= GETTERS / SETTERS ================= */

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public ArtisanProfile getArtisan() { return artisan; }
    public void setArtisan(ArtisanProfile artisan) { this.artisan = artisan; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public byte[] getMedia() { return media; }
    public void setMedia(byte[] media) { this.media = media; }

    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }

    public Integer getViews() { return views; }
    public void setViews(Integer views) { this.views = views; }
}
