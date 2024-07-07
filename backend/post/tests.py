from django.test import TestCase
from account.models import User
from .models import Post


class PostModelTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user for testing
        cls.user = User.objects.create(username='testuser', email="testemail@email.com",  password='password123')

    def setUp(self):
        # Create a post object for each test case
        self.post = Post.objects.create(
            user=self.user,
            title='Test Post',
            description='This is a test post',
        )

    def test_post_creation(self):
        # Test that the post was created successfully
        self.assertEqual(self.post.user, self.user)
        self.assertEqual(self.post.title, 'Test Post')
        self.assertEqual(self.post.description, 'This is a test post')

    def test_post_str_method(self):
        # Test the __str__ method of the post model
        self.assertEqual(str(self.post), 'Test Post')

    def test_post_modified_datetime(self):
        # Test that the modified_datetime field updates automatically
        old_modified_datetime = self.post.modified_datetime
        self.post.title = 'Updated Test Post'
        self.post.save()
        new_modified_datetime = Post.objects.get(pk=self.post.pk).modified_datetime
        self.assertNotEqual(old_modified_datetime, new_modified_datetime)


    def test_post_deletion(self):
        # Test that the post is deleted successfully
        post_count_before_deletion = Post.objects.count()
        self.post.delete()
        post_count_after_deletion = Post.objects.count()
        self.assertEqual(post_count_before_deletion - 1, post_count_after_deletion)
