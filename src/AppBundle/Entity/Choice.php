<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Choice
 *
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ChoiceRepository")
 */
class Choice
{
    /**
     * @var int
     *
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\Type(
     *     groups={"NumberChoice"},
     *     type="integer",
     *     message="The value {{ value }} is not a valid {{ type }}."
     * )
     * @Assert\Range(
     *     groups={"NumberChoice"},
     *     min = 1,
     *     max = 99,
     *     minMessage = "You must pick a number between 1 and 99",
     *     maxMessage = "You must pick a number between 1 and 99"
     * )
     */
    private $value;


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set value
     *
     * @param string $value
     *
     * @return Choice
     */
    public function setValue($value)
    {
        $this->value = $value;

        return $this;
    }

    /**
     * Get value
     *
     * @return string
     */
    public function getValue()
    {
        return $this->value;
    }
}
