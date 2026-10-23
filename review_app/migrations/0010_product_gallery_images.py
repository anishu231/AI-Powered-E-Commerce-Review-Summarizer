from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("review_app", "0009_order"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="gallery_images",
            field=models.JSONField(blank=True, default=list),
        ),
    ]
