/* 
    Policies:
        - S3 access
        - ECR access and image push
        - EC2 cluster management
*/

// S3

data "aws_iam_policy_document" "s3_access_policy_document" {
  statement {
    sid       = "AllowS3Actions"
    actions   = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:ListBucket",
      "s3:GetBucketLocation"
    ]
    effect    = "Allow"
    resources = ["arn:aws:s3:::${var.environment}-studies-bucket"]
  }
}

data "aws_iam_policy_document" "deny_bucket_deletion_policy" {
  statement {
    sid       = "DenyS3BucketDeletion"
    actions   = ["s3:DeleteBucket"]
    resources = ["arn:aws:s3:::${var.environment}-studies-bucket"]
    effect    = "Deny"
  }
}

resource "aws_iam_policy" "deny_bucket_deletion" {
  name        = "DenyS3BucketDeletionPolicy"
  description = "Denies the s3:DeleteBucket action for a specific bucket."
  policy      = data.aws_iam_policy_document.deny_bucket_deletion_policy.json
}


resource "aws_iam_policy" "s3_access_policy" {
  name        = "S3AccessPolicy"
  description = "Provides read and write access to a specific S3 bucket."
  policy      = data.aws_iam_policy_document.s3_access_policy_document.json
}

// ECR

data "aws_iam_policy_document" "read_only_policy_document" {
  statement {
    sid = "AllowECRReadOnly"
    actions = [
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "ecr:DescribeRepositories",
      "ecr:ListImages"
    ]
    resources = ["*"]
    effect    = "Allow"
  }

  statement {
    sid = "AllowEC2ReadOnly"
    actions = [
      "ec2:Describe*"
    ]
    resources = ["*"]
    effect    = "Allow"
  }
}

data "aws_iam_policy_document" "ec2_cluster_policy_document" {
  statement {
    sid       = "AllowReadEC2andEBS"
    actions   = [
      "ec2:DescribeInstances",
      "ec2:DescribeTags",
      "ec2:DescribeVolumes",
      "ec2:DescribeSubnets"
    ]
    resources = ["*"]
    effect    = "Allow"
  }

  statement {
    sid       = "AllowEBSVolumeManagement"
    actions   = [
      "ec2:AttachVolume",
      "ec2:DetachVolume",
      "ec2:CreateVolume",
      "ec2:DeleteVolume"
    ]
    resources = ["*"]
    effect    = "Allow"
  }
  
  statement {
    sid       = "AllowSTSAssumeRole"
    actions   = [
      "sts:AssumeRole"
    ]
    resources = ["*"]
    effect    = "Allow"
  }
}

# Current AWS account ID
data "aws_caller_identity" "current" {}

data "aws_iam_policy_document" "ecr_push_policy_document" {
  statement {
    sid = "AllowECRPush"
    actions = [
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:PutImage",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload"
    ]
    effect = "Allow"
    resources = [
      "arn:aws:ecr:${var.region}:${data.aws_caller_identity.current.account_id}:repository/${var.ecr_repository_name}"
    ]
  }
}

resource "aws_iam_policy" "ecr_push_policy" {
  name        = "ECRPushAccessPolicy-${var.ecr_repository_name}"
  description = "Allows an external pipeline to push images to the ECR repository."
  policy      = data.aws_iam_policy_document.ecr_push_policy_document.json
}

resource "aws_iam_policy" "ec2_cluster_policy" {
  name        = "EC2KubernetesClusterPolicy"
  description = "Provides permissions for Kubernetes cluster EC2 instances."
  policy      = data.aws_iam_policy_document.ec2_cluster_policy_document.json
}

resource "aws_iam_policy" "read_only_policy" {
  name        = "ReadOnlyAccessToEC2andECR"
  description = "Provides read-only access to EC2 and ECR."
  policy      = data.aws_iam_policy_document.read_only_policy_document.json
}


// Roles

data "aws_iam_policy" "ecr_push_policy" {
  name = "ECRPushAccessPolicy-${var.ecr_repository_name}"
}

data "aws_iam_policy_document" "circleci_assume_policy" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"
    
    principals {
      type        = "Federated"
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/oidc.circleci.com/${var.circle_ci_org_id}"]
    }

    condition {
      test     = "StringEquals"
      variable = "oidc.circleci.com/${var.circle_ci_org_id}:sub"
      values   = var.circle_ci_values
    }
  }
}

resource "aws_iam_role" "ecr_push_role" {
  name               = "ECRPushRole-${var.ecr_repository_name}"
  assume_role_policy = data.aws_iam_policy_document.ecr_push_role_assume_policy.json
}

resource "aws_iam_role_policy_attachment" "ecr_push_role_attachment" {
  role       = aws_iam_role.ecr_push_role.name
  policy_arn = data.aws_iam_policy.ecr_push_policy.arn
}

// TODO: #12 configure ArgoCD role